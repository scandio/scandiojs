<?php

namespace Scandio\js;

/**
 * Class Bridge
 * @package Scandio\js
 *
 * Class following conventions for the bridge module in scandiojs.
 * It implements a store for setting values and printing the <script />-tag which will be processed and
 * read by scandiojs.
 */
class Bridge
{
    protected static
        $store          = array(),
        $scriptClass    = 'scandio-js--bridge';

    /**
     * Sets a value to the bridge's data store.
     * - Data may be of any type as it will be json encoded after calling Bridge::script()
     *
     * @param string $dots in dot-notation to the bridge's data store
     * @param mixed $value value to be exposed to scandiojs
     * @param boolean $scalar indicating if value shall be written as scalar or inserted into array
     */
    public static function set($dots, $value, $scalar = true)
    {
        static::setByDotNotation($dots, $value, $scalar);
    }

    /**
     * Gets a value to the bridge's data store.
     *
     * @param string $dots in dot-notation to the bridge's data store
     */
    public static function get($dots)
    {
        return static::resolveByDotNotation($dots);
    }

    /**
     * Removes a value from the bridge's data store.
     *
     * @param string $dots in dot-notation to the bridge's data store
     */
    public static function remove($dots)
    {
        static::removeByDotNotation($dots, $idx);
    }

    /**
     * Generates a <script />-tag to be read by scandiojs
     * - Scandiojs will merge all <script />-tags into one also merging its json-contents.
     *   Obviously the latest <script />-tag's values will take presence in case of duplicates.
     *
     * @return string which is <script />-tag and can be printed anywhere in a template.
     *
     */
    public static function script()
    {
        return '<script type="application/x-json" class="' . static::$scriptClass . '">' . json_encode(static::$store) . '</script>';
    }

    /**
     * Resolves dot-notation at an array (data-store in our case)
     *
     * @param string $dots notation returning the value at the last pointer of the dot-notation.
     * @param array $array to be accessed.
     */
    private static function resolveByDotNotation($dots, $scalar = false)
    {
        # Explode the $def string to array by "."
        $exploded = explode('.', $dots);
        # Initial pointer to array is the private array variable
        $arrPointer = static::$store;

        # Each subsequent dot-value
        foreach ($exploded as $explode) {
            # The value if set, so goto new array pointer
            if ( isset($arrPointer[$explode]) ) {
                $arrPointer = $arrPointer[$explode];
                # Not found the value by dot-notation at given loop run so return null
            } else {
                return null;
            }

            # Finished iterating the array and the value array pointer is pointing to is not another array (except you want a non scalar value)...
            if ( end($exploded) == $explode && ($scalar === false || !is_array($arrPointer)) ) {
                return $arrPointer;
            }
        }
    }

    /**
     * Sets a value in the data-store by dot notation.
     *
     * @param string $dots notation for value to be set
     * @param $value value to be set
     * @param boolean $scalar indicating if value shall be written as scalar or inserted into array
     */
    private static function setByDotNotation($dots, $value, $scalar = true)
    {
        if ($dots == null) { static::$store = $value; }

        $exploded = explode('.', $dots);
        $valuePointer = &static::$store;

        # Loop until end of explodes and reset store's pointer to $valuePointer by reference
        $length = count($exploded);
        for ($i = 0; $i < $length; $i++) {
            $key = $exploded[$i];

            $valuePointer = &$valuePointer[$key];
        }

         if ($scalar === true) {
            $valuePointer = $value;
         } else {
            (array) $valuePointer;
            $valuePointer[] = $value;
         }


        return $valuePointer;
    }

    /**
     * Removes/unsets a value in the data-store by dot notation.
     *
     * @param string $dots notation for value to be removed
     */
    private static function removeByDotNotation($dots)
    {
        if ($dots == null) { static::$store = array(); }

        $exploded = explode('.', $dots);
        $elementPointer = &static::$store;

        # Loop until end of explodes and reset store's pointer to $valuePointer by reference
        $length = count($exploded);
        $key    = $exploded[0];
        for ($i = 0; $i < $length; $i++) {
            $key = $exploded[$i];

            if ( end($exploded) == $key ) {
               unset($elementPointer[$key]);

               return true;
            } else {
                $elementPointer = &$elementPointer[$key];
            }
        }

        return false;
     }
}