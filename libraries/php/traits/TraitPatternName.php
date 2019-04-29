<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-03-24
 * Time: 15:21
 */

namespace QuasarSource\Traits;


trait TraitPatternName {

    /** @var string < A basic string name commonly needed across maybe different types of classes. > */
    protected $name;

    /**
     * Set the name of this object.
     *
     * @param string $name < The name to be set to for this object. >
     */
    public function set_name(string $name) : void {
        $this->name = $name;
    }

    /**
     * Get the name of this object.
     *
     * @return string < The current name of this object. >
     */
    public function get_name() : string {
        return $this->name;
    }

    /**
     * Provide a default implementation for the strval(object_instance) call. Simply returns this objects name.
     *
     * @return string < The current name of this object. >
     */
    public function __toString() : string {
        return $this->name;
    }
}
