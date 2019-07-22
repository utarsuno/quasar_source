<?php declare(strict_types=1);

namespace QuasarSource\Utils\HTTP;
use QuasarSource\CommonFeatures\TraitName;
use QuasarSource\Utils\Exception\ParameterException;

/**
 * Class AbstractHTTPRequest
 * @package QuasarSource\Utils\RequestsHTTP
 */
abstract class AbstractHTTPRequest {
    use TraitName;

    /** @var array */
    protected $params;
    /** @var string */
    protected $request_type;
    /** @var bool */
    protected $cache_response = false;
    protected $cached_response;

    /** @var array $stream_context_settings */
    private $stream_context_settings;

    /**
     * AbstractRequest constructor.
     * @param string       $endpoint
     * @param string|array $header
     * @param string       $request_type
     */
    public function __construct(string $endpoint, $header, string $request_type=UtilsHTTP::REQUEST_TYPE_GET) {
        $this->set_name($endpoint);
        $this->request_type            = $request_type;
        $this->stream_context_settings = ['http' => [
            'method' => $this->request_type,
            'header' => UtilsHTTP::get_header_text($header)
        ]];
    }

    /**
     * @param string $key
     * @param $value
     */
    protected function context_settings_add(string $key, $value): void {
        $this->stream_context_settings['http'][$key] = $value;
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
        $this->finalize_stream_context_settings();
        return UtilsHTTP::execute($url, $this->stream_context_settings);
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
            case UtilsHTTP::REQUEST_TYPE_GET:
                $query = $this->get_url_query();
                if ($query !== null && $query !== '') {
                    return $this->name . '?' . $query;
                }
                return $this->name;
            case UtilsHTTP::REQUEST_TYPE_POST:
                // Intentionally left empty.
            case UtilsHTTP::REQUEST_TYPE_DELETE:
                return $this->name;
            default:
                throw ParameterException::invalid_function_parameter('get_url', $this->request_type);
        }
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

    abstract protected function finalize_stream_context_settings(): void;

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
