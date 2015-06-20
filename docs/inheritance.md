---
layout: docs
title: Inheritance
permalink: /docs/inheritance/
section: docs
---

Classes that have extended `Base.extend` inherit all prototypical and static methods that are on
that class.  These can be extended using the `.extend` method infinitely.

    var Grandchild = Child.extend({

        _private: function () {
            return 'shhh';
        }

    });

    var obj1 = new Grandchild('param1', 'param2');

    obj1.getParam1(); // 'param1'

    Grandchild.staticMethod(); // 'method'
