 /*jslint white:true, nomen: true, plusplus: true */
/*global mx, define, require, browser, devel, console, document, jQuery */
/*mendix */
/*
    Taggd
    ========================

    @file      : Taggd.js
    @version   : 1.0.0
    @author    : Christopher James Hodges
    @date      : Tue, 16 Jun 2015 13:24:55 GMT
    @copyright : 
    @license   : 

    Documentation
    ========================
    Describe your widget here.
*/

// Required module list. Remove unnecessary modules, you can always get them back from the boilerplate.
define([
    'dojo/_base/declare', 'mxui/widget/_WidgetBase', 'dijit/_TemplatedMixin',
    'mxui/dom', 'dojo/dom', 'dojo/query', 'dojo/dom-prop', 'dojo/dom-geometry', 'dojo/dom-class', 'dojo/dom-style', 'dojo/dom-construct', 'dojo/_base/array', 'dojo/_base/lang', 'dojo/text', 'dojo/html', 'dojo/_base/event',
    'Taggd/lib/jquery-1.11.2.min', 'dojo/text!Taggd/widget/template/Taggd.html', 'Taggd/lib/jquery.taggd.min'
], function (declare, _WidgetBase, _TemplatedMixin, dom, dojoDom, domQuery, domProp, domGeom, domClass, domStyle, domConstruct, dojoArray, lang, text, html, event, _jQuery, widgetTemplate) {
    'use strict';

    var $ = jQuery.noConflict(true);

    // Declare widget's prototype.
    return declare('Taggd.widget.Taggd', [_WidgetBase, _TemplatedMixin], {

        // _TemplatedMixin will create our dom node using this HTML template.
        templateString: '<div class="wrapper"><img class="taggd" data-dojo-attach-point="imageNode"/></div>',

        // Parameters configured in the Modeler.
        backgroundImage: "",
        arrayString: "",
        dataString: "",


        // dojo.declare.constructor is called to construct the widget instance. Implement to initialize non-primitive properties.
        constructor: function () {
            this._handles = [];
        },

        // dijit._WidgetBase.postCreate is called after constructing the widget. Implement to do extra setup work.
        postCreate: function () {
            console.log(this.id + '.postCreate');
        },

        // mxui.widget._WidgetBase.update is called when context is changed or initialized. Implement to re-render and / or fetch data.
        update: function (obj, callback) {
            console.log(this.id + '.update');

            this._contextObj = obj;
            this.dataString = obj.get(this.arrayString);
            this._setupEvents();
            callback();
        },

        setupData: function (stringData) {
            var data = [];
            var array = stringData.split(";");
            var arrayLength = array.length;
            for (var i = 0; i < arrayLength; i++) {
                var dataItem = array[i].split(",");
                var taggdData = {
                    x: dataItem[0],
                    y: dataItem[1],
                    text: dataItem[2]
                };
                data.push(taggdData);

            }
            return data;
        },

        createArrayString: function (dataArray) {
            var arrayToString = "";
            var arrayLength = dataArray.length;
            for (var i = 0; i < arrayLength; i++) {
                var text = dataArray[i].text;
                var x = dataArray[i].x;
                var y = dataArray[i].y;
                if (dataArray.length > 1) {
                    arrayToString = arrayToString + x + "," + y + "," + text + ";";
                } else {
                    arrayToString = x + "," + y + "," + text + ";"
                }
            }

            return arrayToString;

        },

        updateData: function (arrayString) {
            this._contextObj.set(this.arrayString, arrayString);
            mx.data.save({
                mxobj: this._contextObj,
                callback: function () {
                    console.log("Object saved");
                }
            });
        },

        cleanData: function () {
            this._contextObj.set(this.arrayString, "");
            mx.data.save({
                mxobj: this._contextObj,
                callback: function () {
                    console.log("Object saved");
                }
            });
        },

        // Attach events to HTML dom elements
        _setupEvents: function () {

            this.imageNode.src = this.backgroundImage;
            var options = {
                edit: true,
                align: {
                    y: 'top'
                },
                offset: {
                    top: 15
                },
                handlers: {
                    click: 'toggle'
                }
            };

            var taggd = $('.taggd').taggd(options, this.setupData(this.dataString));
            
            var node = $('.taggd');
            
            node.on('change', lang.hitch(this, function () {
                this.updateData(this.createArrayString(taggd.data));
                
            }));
        }

    });
});
require(['Taggd/widget/Taggd'], function () {
    'use strict';
});