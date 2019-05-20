<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-03-24
 * Time: 15:21
 */

namespace QuasarSource\Traits;


trait TraitPatternName {

    /** @var string < A basic string name commonly needed across maybe different types of classes.                    > */
    protected $name;
    /** @var string < Utility variable to set a label (often the Class name) for printing format such as LABEL{NAME}. > */
    protected $label;

    /**
     * @param string $name
     * @param string $label
     * @return self
     */
    public function set_name_and_label(string $name, string $label): self {
        $this->name  = $name;
        $this->label = $label;
        return $this;
    }

    /**
     * Set the name of this object.
     *
     * @param string $name < The name to be set to for this object. >
     * @return self
     */
    public function set_name(string $name): self {
        $this->name = $name;
        return $this;
    }

    /**
     * Set the label of this object.
     *
     * @param string $label
     * @return self
     */
    public function set_label(string $label): self {
        $this->label = $label;
        return $this;
    }

    /**
     * Get the name of this object.
     *
     * @return string < The current name of this object. >
     */
    public function get_name(): string {
        return $this->name;
    }

    /**
     * Provide a default implementation for the strval(object_instance) call. Simply returns this objects name.
     *
     * @return string < The current name of this object. >
     */
    public function __toString(): string {
        if ($this->label !== null) {
            return $this->label . '{' . $this->name . '}';
        }
        return $this->name;
    }
}
