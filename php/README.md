# Scandiojs and php

*Scandiojs* currently allows communication with php via a `<script />`-tag. Nevertheless, a set of components coupling *scandiojs* and php might grow over time.

The library is available as a *composer* package and is also listed on *packagist*. Nevertheless, free feel to just copy parts of it into your project where needed.

## Scandio\js\Bridge

A little helper which may be used in views/templates to store data and communicate with the `Scandio.bridge`-module of *scandiojs*.

### By having the following Html file with php in it

```php
<html>
   <?php
      use Scandio\js\Bridge as Bridge;
   ?>
   <head>
   </head>
   <body>
      <ul>
         <?php foreach ($customers as $customer): ?>
            <li><?= $customer->name ?></li>

            // Giving true as last parameter will treat the
            // 'customers' as an array and won't overwrite
            <?php Bridge::set('customers', $customer->name, true); ?>
         <?php endforeach; ?>
      </ul>

      <?= Bridge::script(); ?>
   </body>
</html>
```

The Bridge so it can also be used in a templating language by regisstering it e.g. as a global in *Twig*.

### Other examples

```php
<?php
use Scandio\js\Bridge as Bridge;

// Set values by dot-notation
Bridge::set('key.nested', array('foo', 'bar'));
Bridge::set('key.nested2', array('izzle', 'for'));
Bridge::set('key.nested3', array('shizzle', 'minizzle!!'));

// Overwrites an exisiting value
Bridge::set('key.nested', 2);

// Removes/unset thes value
Bridge::remove('key.nested');

echo Bridge::script();
?>
```

### Retrieval in JavaScript

```js
$(function() {
   var customers = Scandio.bridge.get('customers', []);
});
```

On howto retrieve data later on at JavaScript runtime on the client also check out another [example](https://github.com/scandio/scandiojs/blob/master/example/index.js#L277).

*Note:* You can also generate multiple `<script />`-tags and spread them all over your document. *Scandiojs* will aggregate their data into a brand new one in the document's `<head />`-section. Obviously data will be merged and in the case of duplicate properties the latest occurancy takes precedence.