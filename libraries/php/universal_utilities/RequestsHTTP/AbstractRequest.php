<?php declare(strict_types=1);

namespace QuasarSource\Utilities\RequestsHTTP;
use QuasarSource\Traits\TraitName;
use QuasarSource\Utilities\Exception\ParameterException;
use QuasarSource\Utilities\StringUtilities as STR;


abstract class AbstractRequest {
    use TraitName;

    protected const NEW_LINE         = "\r\n";
    protected const HEADER_DEFAULT   = 'User-Agent: Mozilla/4.0 (compatible; PHP API)' . self::NEW_LINE;
    public const REQUEST_TYPE_GET    = 'GET';
    public const REQUEST_TYPE_POST   = 'POST';
    public const REQUEST_TYPE_DELETE = 'DELETE';

    public static function execute_http_request(string $url, $context): string {
        return file_get_contents($url, false, $context);
    }

    /** @var array */
    protected $params;
    /** @var string */
    protected $request_type;
    /** @var bool */
    protected $cache_response = false;
    protected $cached_response;

    public function __construct(string $endpoint, string $request_type=self::REQUEST_TYPE_GET) {
        $this->set_name($endpoint);
        $this->request_type = $request_type;
    }

    protected function cache_the_response(): void {
        $this->cache_response = true;
    }

    protected function cache_reset(): void {
        $this->cached_response = null;
    }

    /**
     * @return string
     */
    protected function run_http_request(): string {
        # Calculate URL first.
        $url = $this->get_url();
        return self::execute_http_request($url, $this->get_new_stream_context());
    }

    /**
     * @param null $args
     * @return mixed
     */
    public function execute($args=null) {
        if ($this->cache_response) {
            if ($this->cached_response === null) {
                $this->parse_args($args);
                $this->cached_response = $this->parse_response($this->run_http_request());
            }
            return $this->cached_response;
        }
        $this->parse_args($args);
        return $this->parse_response($this->run_http_request());
    }

    /**
     * @return string
     * @throws ParameterException
     */
    protected function get_url(): string {
        switch ($this->request_type) {
            case self::REQUEST_TYPE_GET:
                $query = $this->get_url_query();
                if ($query !== null && $query !== '') {
                    return $this->name . '?' . $query;
                }
                return $this->name;
            case self::REQUEST_TYPE_POST:
                return $this->name;
            case self::REQUEST_TYPE_DELETE:
                return $this->name;
            default:
                throw ParameterException::invalid_function_parameter('get_url', $this->request_type);
        }
    }

    /*    ___ ___  __      __   ___ ___ ___         __   __
     |__|  |   |  |__)    /__` |__   |   |  | |\ | / _` /__`
     |  |  |   |  |       .__/ |___  |   |  | | \| \__> .__/ */
    /**
     * @return string
     */
    protected function get_header(): string {
        return self::HEADER_DEFAULT;
    }

    /**
     * @return array
     */
    protected function get_stream_context_settings(): array {
        return [
            'http' => [
                'method' => $this->request_type,
                'header' => $this->get_header()
            ]
        ];
    }

    /**
     * @return resource
     */
    protected function get_new_stream_context() {
        return stream_context_create($this->get_stream_context_settings());
    }

    /*__        __              __
     |__)  /\  |__)  /\   |\/| /__`
     |    /~~\ |  \ /~~\  |  | .__/ */
    /**
     * @return string
     */
    protected function get_url_query(): string {
        if ($this->has_params()) {
            return $this->get_params_as_query();
        }
        return '';
    }

    /**
     * @return string
     */
    protected function get_params_as_query(): string {
        return http_build_query($this->params, '', '&');
    }

    /**
     * @return bool
     */
    protected function has_params(): bool {
        return $this->params !== null && count($this->params) !== 0;
    }

    /**
     * @param string $key
     * @param $value
     */
    protected function param_set(string $key, $value): void {
        if ($this->params === null) {
            $this->params = [];
        }
        $this->params[$key] = $value;
    }

    /*     __   __  ___  __        __  ___
      /\  |__) /__`  |  |__)  /\  /  `  |
     /~~\ |__) .__/  |  |  \ /~~\ \__,  |  */
    /**
     * @param null $args
     * @return mixed
     */
    abstract protected function parse_args($args=null);

    /**
     * @param $response
     * @return mixed
     */
    abstract protected function parse_response($response);
}
