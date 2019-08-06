<?php declare(strict_types=1);

namespace CodeManager\Entity\CodeManager;

use CodeManager\Entity\Abstractions\AbstractEntity;
use CodeManager\Repository\File\RepoDirectory;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping\Column;
use Doctrine\ORM\Mapping\Entity;
use Doctrine\ORM\Mapping\OneToMany;
use Doctrine\ORM\Mapping\Table;
use InvalidArgumentException;
use QuasarSource\Doctrine\Entity\Field\Color\TraitHexColor1;
use QuasarSource\Doctrine\Entity\Field\Number\Int\Small\TraitSmallInt1;
use QuasarSource\Doctrine\Entity\Field\Text\Blob\TraitBigText0;
use QuasarSource\Doctrine\Entity\Field\Text\TraitDescription;
use QuasarSource\Doctrine\Entity\Field\Text\TraitText4;
use QuasarSource\Doctrine\Fields\EnumFields      as FIELD;
use QuasarSource\Utils\DataType\Object\UtilsJSON as JSON;
use QuasarSource\Utils\File\UtilsDirectory       as DIR;
use RuntimeException;

/**
 * Class EntityCodeProject
 *
 * @see https://developers.google.com/web/fundamentals/web-app-manifest/
 *
 * @Entity(repositoryClass="CodeManager\Repository\CodeManager\RepoCodeProject", readOnly=true)
 * @Table(name="code_project")
 *
 * @method EntityCodeProject setURL(string $url)
 * @method EntityCodeProject setStartURL(string $url)
 * @method EntityCodeProject setDisplay(string $display)
 * @method EntityCodeProject setOrientation(int $url)
 * @method EntityCodeProject setColorTheme(string $hex_color)
 * @method EntityCodeProject setColorBackground(string $hex_color)
 * @method EntityCodeProject setPathAssets(string $path)
 * @method EntityCodeProject setPathVar(string $path)
 * @method EntityCodeProject setPathOutput(string $path)
 * @method string getURL()
 * @method string getColorTheme()
 * @method string getColorBackground()
 * @method string getStartURL()
 * @method string getPathAssets()
 * @method string getPathVar()
 * @method string getPathOutput()
 * @method int getDisplay()
 * @method int getOrientation()
 */
class EntityCodeProject extends AbstractEntity {
    use TraitDescription;
    // {URL, Start URL, Path Assets, Path Var, Path Output}
    use TraitText4;
    // {Orientation Type, Display Type}
    use TraitSmallInt1;
    // {Categories}
    use TraitBigText0;
    // {ColorTheme, ColorBackground}
    use TraitHexColor1;

    public static $db_table_name   = 'code_project';
    protected static $func_aliases = [
        'URL'             => FIELD::TEXT_0,
        'StartURL'        => FIELD::TEXT_1,
        'PathAssets'      => FIELD::TEXT_2,
        'PathVar'         => FIELD::TEXT_3,
        'PathOutput'      => FIELD::TEXT_4,
        'Orientation'     => FIELD::SMALL_INT_0,
        'Display'         => FIELD::SMALL_INT_1,
        'ColorTheme'      => FIELD::HEX_COLOR_0,
        'ColorBackground' => FIELD::HEX_COLOR_1
    ];

    # TODO: https://developer.mozilla.org/en-US/docs/Web/Manifest/orientation
    public const ORIENTATION_TO_STRING = ['landscape', 'portrait', 'dynamic', 'na'];

    /** @see https://developer.mozilla.org/en-US/docs/Web/Manifest/display */
    public const DISPLAY_TO_STRING     = ['fullscreen', 'standalone', 'minimal-ui', 'browser'];

    /** @see https://github.com/w3c/manifest/wiki/Categories */
    public const CATEGORY_TO_STRING    = [
        'books', 'business', 'education', 'entertainment', 'finance', 'fitness', 'food', 'games', 'government',
        'health', 'kids', 'lifestyle', 'magazines', 'medical', 'music', 'navigation', 'news', 'personalization',
        'photo', 'politics', 'productivity', 'security', 'shopping', 'social', 'sports', 'travel', 'utilities', 'weather'
    ];

    /** @var $cached_categories */
    protected $cached_categories;

    /**
     * @var string
     * @Column(name="name_full", type="string", nullable=false, unique=true, length=128)
     */
    protected $name_full;

    /**
     * @var string
     * @Column(name="name_short", type="string", nullable=false, unique=true, length=32)
     */
    protected $name_short;

    /**
     * Child code procedures.
     *
     * @var Collection $procedures
     * @OneToMany(targetEntity="CodeManager\Entity\CodeManager\EntityCodeProcedure", mappedBy="code_project")
     */
    protected $procedures;

    # --------------------------------------------------- M A G I C ----------------------------------------------------
    public function __construct() {
        $this->procedures = new ArrayCollection();
    }

    public function __destruct() {
        unset($this->cached_categories);
    }

    /**
     * @return string
     */
    public function __toString(): string {
        return 'Project{' . $this->getNameFull() . '}';
    }

    # -------------------------------------------------- P U B L I C ---------------------------------------------------

    private $cached_dir_output;
    private $cached_dir_assets;
    private $cached_dir_var;

    /**
     * @param  RepoDirectory $repo
     * @return void
     */
    public function cache_directories(RepoDirectory $repo): void {
        $this->validate_path($this->getPathOutput());
        $this->validate_path($this->getPathVar());
        $this->validate_path($this->getPathAssets());
    }

    /**
     * @param  string $path
     * @return void
     */
    private function validate_path(string $path): void {
        if (!DIR::create_if_dne_but_base_exists($path)) {
            throw new RuntimeException('Project{' . $this->getNameFull() . '} could not validate or create path{' . $path . '}');
        }
    }

    /**
     * @param  bool $as_string
     * @return string|array
     */
    public function get_web_manifest(bool $as_string) {
        $json = [
            'name'             => $this->name_full,
            'short_name'       => $this->name_short,
            'description'      => $this->getDescription(),
            'categories'       => $this->getCategoriesAsArray(),
            'lang'             => 'en-US',
            'scope'            => '<all_urls>',
            'display'          => $this->getDisplayAsString(),
            'orientation'      => $this->getOrientationAsString(),
            'theme_color'      => $this->color_to_word($this->getColorTheme()),
            'background_color' => $this->color_to_word($this->getColorBackground()),
            'start_url'        => $this->getStartURL()
        ];
        if ($as_string) {
            $json = JSON::to_pretty_json($json);
        }
        return $json;
    }

    /**
     * @return Collection
     */
    public function getCodeProcedures(): Collection {
        return $this->procedures;
    }

    /**
     * @param  EntityCodeProcedure $code_procedure
     * @return EntityCodeProject
     */
    public function addCodeProcedure(EntityCodeProcedure $code_procedure): self {
        if (!$this->procedures->contains($code_procedure)) {
            $this->procedures[] = $code_procedure;
            $code_procedure->setCodeProject($this);
        }
        return $this;
    }

    /**
     * @param  EntityCodeProcedure $code_procedure
     * @return EntityCodeProject
     */
    public function removeCodeProcedure(EntityCodeProcedure $code_procedure): self {
        if ($this->procedures->contains($code_procedure)) {
            $this->procedures->removeElement($code_procedure);
            if ($code_procedure->getCodeProject() === $this) {
                $code_procedure->setCodeProject(null);
            }
        }
        return $this;
    }


    /**
     * @param  string $categories
     * @return EntityCodeProject
     */
    public function setCategories(string $categories): self {
        return $this->setBlob0($categories);
    }

    /**
     * @return string
     */
    public function getCategories(): string {
        return $this->getBlob0();
    }

    /**
     * @return array
     */
    public function getCategoriesAsArray(): array {
        if ($this->cached_categories === null) {
            $this->cached_categories = json_decode($this->getCategories(), true);
        }
        return $this->cached_categories;
    }

    /**
     * @return string
     */
    public function getOrientationAsString(): string {
        return self::ORIENTATION_TO_STRING[$this->smallint0];
    }

    /**
     * @return string
     */
    public function getDisplayAsString(): string {
        return self::DISPLAY_TO_STRING[$this->smallint1];
    }

    /**
     * @return string
     */
    public function getNameFull(): string {
        return $this->name_full;
    }

    /**
     * @param string $name_full
     * @return EntityCodeProject
     */
    public function setNameFull(string $name_full): self {
        $this->name_full = $name_full;
        return $this;
    }

    /**
     * @return string
     */
    public function getNameShort(): string {
        return $this->name_short;
    }

    /**
     * @param string $name_short
     * @return EntityCodeProject
     */
    public function setNameShort(string $name_short): self {
        $this->name_short = $name_short;
        return $this;
    }

    /**
     * @param  string $color
     * @return string
     */
    private function color_to_word(string $color): string {
        if ($color === '696969') {
            return 'dimgray';
        }
        if (strtolower($color) === '98fb98') {
            return 'palegreen';
        }
        throw new InvalidArgumentException('Color provided{' . $color . '} could not be converted into a word!');
    }

}
