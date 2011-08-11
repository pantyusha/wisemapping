/*
 *    Copyright [2011] [wisemapping]
 *
 *   Licensed under WiseMapping Public License, Version 1.0 (the "License").
 *   It is basically the Apache License, Version 2.0 (the "License") plus the
 *   "powered by wisemapping" text requirement on every single page;
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the license at
 *
 *       http://www.wisemapping.org/license
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 */

mindplot.widget.ColorPalettePanel = new Class({
    Extends: mindplot.widget.ToolbarItem,

    initialize : function(buttonId, model, baseUrl) {
        this.parent(buttonId, model);
        $assert(baseUrl, "baseUrl can not be null");

        this.getButtonElem().addEvent('click', function() {
            // Is the panel being displayed ?
            if (this.isVisible()) {
                this.hide();
            } else {
                this.show();
            }

        }.bind(this));
        this._baseUrl = baseUrl;
    },

    _load : function() {

        if (!mindplot.widget.ColorPalettePanel._panelContent) {

            // Load all the CSS styles ...
            Asset.css(this._baseUrl + '/colorPalette.css', {id: 'colorPaletteStyle', title: 'colorPalette'});

            // Load panel html fragment ...
            var result;
            var request = new Request({
                url: this._baseUrl + '/colorPalette.html',
                method: 'get',
                async: false,
                onRequest: function() {
                    console.log("loading ...");
                },
                onSuccess: function(responseText) {
                    result = responseText;
                },
                onFailure: function() {
                    result = '<div>Sorry, your request failed :(</div>';
                }
            });
            request.send();
            mindplot.widget.ColorPalettePanel._panelContent = result;

        }
        return mindplot.widget.ColorPalettePanel._panelContent;
    },

    _init : function() {
        if (!this._panelContent) {
            var buttonElem = this.getButtonElem();

            // Add panel content ..
            var panelElem = this.buildPanel();
            panelElem.setStyle('display', 'none');
            panelElem.inject(buttonElem);

            // Register on toolbar elements ...
            var colorCells = panelElem.getElements('div[class=palette-colorswatch]');
            var model = this.getModel();
            colorCells.forEach(function(elem) {
                elem.addEvent('click', function() {
                    var color = elem.getStyle("background-color");
                    model.setValue(color);
                });
            });
            this._panelId = panelElem.id;
            this._panelContent = true;
        }

    },

    buildPanel: function() {
        var content = new Element("div", {'class':'toolbarPanel','id': this._buttonId + 'colorPalette'});
        content.innerHTML = this._load();
        return content;
    },

    _getPanelElem : function () {
        this._init();
        return $(this._panelId);
    },

    show : function() {
        if (!this.isVisible()) {

            this.parent();
            var panelElem = this._getPanelElem();

            // Clear selected cell based on the color  ...
            var tdCells = panelElem.getElements("td[class='palette-cell palette-cell-selected']");
            tdCells.forEach(function(elem) {
                elem.className = 'palette-cell';
            });

            // Mark the cell as selected ...
            var colorCells = panelElem.getElements('div[class=palette-colorswatch]');
            var model = this.getModel();
            var modelValue = model.getValue();
            colorCells.forEach(function(elem) {
                var color = elem.getStyle("background-color");
                if (modelValue == color) {
                    elem.parentNode.className = 'palette-cell palette-cell-selected';
                }
            });

            // Finally, display the dialog ...
            panelElem.setStyle('display', 'block');
        }
    },

    hide : function() {
        if (this.isVisible()) {
            this.parent();
            this._getPanelElem().setStyle('display', 'none');
        }
    },

    isVisible : function() {
        return this._getPanelElem().getStyle('display') == 'block';
    }
});