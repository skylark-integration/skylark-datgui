define([
    '../utils/css',
    './saveDialogue.html',
    '../controllers/ControllerFactory',
    '../controllers/Controller',
    '../controllers/BooleanController',
    '../controllers/FunctionController',
    '../controllers/NumberControllerBox',
    '../controllers/NumberControllerSlider',
    '../controllers/ColorController',
    '../utils/requestAnimationFrame',
    '../dom/CenteredDiv',
    '../dom/dom',
    '../utils/common'
], function (css, saveDialogueContents, ControllerFactory, Controller, BooleanController, FunctionController, NumberControllerBox, NumberControllerSlider, ColorController, requestAnimationFrame, CenteredDiv, dom, common, styleSheet) {
    'use strict';

    //css.inject(styleSheet);

    const CSS_NAMESPACE = 'dg';
    const HIDE_KEY_CODE = 72;
    const CLOSE_BUTTON_HEIGHT = 20;
    const DEFAULT_DEFAULT_PRESET_NAME = 'Default';
    const SUPPORTS_LOCAL_STORAGE = function () {
        try {
            return !!window.localStorage;
        } catch (e) {
            return false;
        }
    }();
    let SAVE_DIALOGUE;
    let autoPlaceVirgin = true;
    let autoPlaceContainer;
    let hide = false;
    const hideableGuis = [];
    const GUI = function (pars) {
        const _this = this;
        let params = pars || {};
        this.domElement = document.createElement('div');
        this.__ul = document.createElement('ul');
        this.domElement.appendChild(this.__ul);
        dom.addClass(this.domElement, CSS_NAMESPACE);
        this.__folders = {};
        this.__controllers = [];
        this.__rememberedObjects = [];
        this.__rememberedObjectIndecesToControllers = [];
        this.__listening = [];
        params = common.defaults(params, {
            closeOnTop: false,
            autoPlace: true,
            width: GUI.DEFAULT_WIDTH
        });
        params = common.defaults(params, {
            resizable: params.autoPlace,
            hideable: params.autoPlace
        });
        if (!common.isUndefined(params.load)) {
            if (params.preset) {
                params.load.preset = params.preset;
            }
        } else {
            params.load = { preset: DEFAULT_DEFAULT_PRESET_NAME };
        }
        if (common.isUndefined(params.parent) && params.hideable) {
            hideableGuis.push(this);
        }
        params.resizable = common.isUndefined(params.parent) && params.resizable;
        if (params.autoPlace && common.isUndefined(params.scrollable)) {
            params.scrollable = true;
        }
        let useLocalStorage = SUPPORTS_LOCAL_STORAGE && localStorage.getItem(getLocalStorageHash(this, 'isLocal')) === 'true';
        let saveToLocalStorage;
        let titleRow;
        Object.defineProperties(this, {
            parent: {
                get: function () {
                    return params.parent;
                }
            },
            scrollable: {
                get: function () {
                    return params.scrollable;
                }
            },
            autoPlace: {
                get: function () {
                    return params.autoPlace;
                }
            },
            closeOnTop: {
                get: function () {
                    return params.closeOnTop;
                }
            },
            preset: {
                get: function () {
                    if (_this.parent) {
                        return _this.getRoot().preset;
                    }
                    return params.load.preset;
                },
                set: function (v) {
                    if (_this.parent) {
                        _this.getRoot().preset = v;
                    } else {
                        params.load.preset = v;
                    }
                    setPresetSelectIndex(this);
                    _this.revert();
                }
            },
            width: {
                get: function () {
                    return params.width;
                },
                set: function (v) {
                    params.width = v;
                    setWidth(_this, v);
                }
            },
            name: {
                get: function () {
                    return params.name;
                },
                set: function (v) {
                    params.name = v;
                    if (titleRow) {
                        titleRow.innerHTML = params.name;
                    }
                }
            },
            closed: {
                get: function () {
                    return params.closed;
                },
                set: function (v) {
                    params.closed = v;
                    if (params.closed) {
                        dom.addClass(_this.__ul, GUI.CLASS_CLOSED);
                    } else {
                        dom.removeClass(_this.__ul, GUI.CLASS_CLOSED);
                    }
                    this.onResize();
                    if (_this.__closeButton) {
                        _this.__closeButton.innerHTML = v ? GUI.TEXT_OPEN : GUI.TEXT_CLOSED;
                    }
                }
            },
            load: {
                get: function () {
                    return params.load;
                }
            },
            useLocalStorage: {
                get: function () {
                    return useLocalStorage;
                },
                set: function (bool) {
                    if (SUPPORTS_LOCAL_STORAGE) {
                        useLocalStorage = bool;
                        if (bool) {
                            dom.bind(window, 'unload', saveToLocalStorage);
                        } else {
                            dom.unbind(window, 'unload', saveToLocalStorage);
                        }
                        localStorage.setItem(getLocalStorageHash(_this, 'isLocal'), bool);
                    }
                }
            }
        });
        if (common.isUndefined(params.parent)) {
            this.closed = params.closed || false;
            dom.addClass(this.domElement, GUI.CLASS_MAIN);
            dom.makeSelectable(this.domElement, false);
            if (SUPPORTS_LOCAL_STORAGE) {
                if (useLocalStorage) {
                    _this.useLocalStorage = true;
                    const savedGui = localStorage.getItem(getLocalStorageHash(this, 'gui'));
                    if (savedGui) {
                        params.load = JSON.parse(savedGui);
                    }
                }
            }
            this.__closeButton = document.createElement('div');
            this.__closeButton.innerHTML = GUI.TEXT_CLOSED;
            dom.addClass(this.__closeButton, GUI.CLASS_CLOSE_BUTTON);
            if (params.closeOnTop) {
                dom.addClass(this.__closeButton, GUI.CLASS_CLOSE_TOP);
                this.domElement.insertBefore(this.__closeButton, this.domElement.childNodes[0]);
            } else {
                dom.addClass(this.__closeButton, GUI.CLASS_CLOSE_BOTTOM);
                this.domElement.appendChild(this.__closeButton);
            }
            dom.bind(this.__closeButton, 'click', function () {
                _this.closed = !_this.closed;
            });
        } else {
            if (params.closed === undefined) {
                params.closed = true;
            }
            const titleRowName = document.createTextNode(params.name);
            dom.addClass(titleRowName, 'controller-name');
            titleRow = addRow(_this, titleRowName);
            const onClickTitle = function (e) {
                e.preventDefault();
                _this.closed = !_this.closed;
                return false;
            };
            dom.addClass(this.__ul, GUI.CLASS_CLOSED);
            dom.addClass(titleRow, 'title');
            dom.bind(titleRow, 'click', onClickTitle);
            if (!params.closed) {
                this.closed = false;
            }
        }
        if (params.autoPlace) {
            if (common.isUndefined(params.parent)) {
                if (autoPlaceVirgin) {
                    autoPlaceContainer = document.createElement('div');
                    dom.addClass(autoPlaceContainer, CSS_NAMESPACE);
                    dom.addClass(autoPlaceContainer, GUI.CLASS_AUTO_PLACE_CONTAINER);
                    document.body.appendChild(autoPlaceContainer);
                    autoPlaceVirgin = false;
                }
                autoPlaceContainer.appendChild(this.domElement);
                dom.addClass(this.domElement, GUI.CLASS_AUTO_PLACE);
            }
            if (!this.parent) {
                setWidth(_this, params.width);
            }
        }
        this.__resizeHandler = function () {
            _this.onResizeDebounced();
        };
        dom.bind(window, 'resize', this.__resizeHandler);
        dom.bind(this.__ul, 'webkitTransitionEnd', this.__resizeHandler);
        dom.bind(this.__ul, 'transitionend', this.__resizeHandler);
        dom.bind(this.__ul, 'oTransitionEnd', this.__resizeHandler);
        this.onResize();
        if (params.resizable) {
            addResizeHandle(this);
        }
        saveToLocalStorage = function () {
            if (SUPPORTS_LOCAL_STORAGE && localStorage.getItem(getLocalStorageHash(_this, 'isLocal')) === 'true') {
                localStorage.setItem(getLocalStorageHash(_this, 'gui'), JSON.stringify(_this.getSaveObject()));
            }
        };
        this.saveToLocalStorageIfPossible = saveToLocalStorage;
        function resetWidth() {
            const root = _this.getRoot();
            root.width += 1;
            common.defer(function () {
                root.width -= 1;
            });
        }
        if (!params.parent) {
            resetWidth();
        }
    };
    GUI.toggleHide = function () {
        hide = !hide;
        common.each(hideableGuis, function (gui) {
            gui.domElement.style.display = hide ? 'none' : '';
        });
    };
    GUI.CLASS_AUTO_PLACE = 'a';
    GUI.CLASS_AUTO_PLACE_CONTAINER = 'ac';
    GUI.CLASS_MAIN = 'main';
    GUI.CLASS_CONTROLLER_ROW = 'cr';
    GUI.CLASS_TOO_TALL = 'taller-than-window';
    GUI.CLASS_CLOSED = 'closed';
    GUI.CLASS_CLOSE_BUTTON = 'close-button';
    GUI.CLASS_CLOSE_TOP = 'close-top';
    GUI.CLASS_CLOSE_BOTTOM = 'close-bottom';
    GUI.CLASS_DRAG = 'drag';
    GUI.DEFAULT_WIDTH = 245;
    GUI.TEXT_CLOSED = 'Close Controls';
    GUI.TEXT_OPEN = 'Open Controls';
    GUI._keydownHandler = function (e) {
        if (document.activeElement.type !== 'text' && (e.which === HIDE_KEY_CODE || e.keyCode === HIDE_KEY_CODE)) {
            GUI.toggleHide();
        }
    };
    dom.bind(window, 'keydown', GUI._keydownHandler, false);
    common.extend(GUI.prototype, {
        add: function (object, property) {
            return add(this, object, property, { factoryArgs: Array.prototype.slice.call(arguments, 2) });
        },
        addColor: function (object, property) {
            return add(this, object, property, { color: true });
        },
        remove: function (controller) {
            this.__ul.removeChild(controller.__li);
            this.__controllers.splice(this.__controllers.indexOf(controller), 1);
            const _this = this;
            common.defer(function () {
                _this.onResize();
            });
        },
        destroy: function () {
            if (this.parent) {
                throw new Error('Only the root GUI should be removed with .destroy(). ' + 'For subfolders, use gui.removeFolder(folder) instead.');
            }
            if (this.autoPlace) {
                autoPlaceContainer.removeChild(this.domElement);
            }
            const _this = this;
            common.each(this.__folders, function (subfolder) {
                _this.removeFolder(subfolder);
            });
            dom.unbind(window, 'keydown', GUI._keydownHandler, false);
            removeListeners(this);
        },
        addFolder: function (name) {
            if (this.__folders[name] !== undefined) {
                throw new Error('You already have a folder in this GUI by the' + ' name "' + name + '"');
            }
            const newGuiParams = {
                name: name,
                parent: this
            };
            newGuiParams.autoPlace = this.autoPlace;
            if (this.load && this.load.folders && this.load.folders[name]) {
                newGuiParams.closed = this.load.folders[name].closed;
                newGuiParams.load = this.load.folders[name];
            }
            const gui = new GUI(newGuiParams);
            this.__folders[name] = gui;
            const li = addRow(this, gui.domElement);
            dom.addClass(li, 'folder');
            return gui;
        },
        removeFolder: function (folder) {
            this.__ul.removeChild(folder.domElement.parentElement);
            delete this.__folders[folder.name];
            if (this.load && this.load.folders && this.load.folders[folder.name]) {
                delete this.load.folders[folder.name];
            }
            removeListeners(folder);
            const _this = this;
            common.each(folder.__folders, function (subfolder) {
                folder.removeFolder(subfolder);
            });
            common.defer(function () {
                _this.onResize();
            });
        },
        open: function () {
            this.closed = false;
        },
        close: function () {
            this.closed = true;
        },
        hide: function () {
            this.domElement.style.display = 'none';
        },
        show: function () {
            this.domElement.style.display = '';
        },
        onResize: function () {
            const root = this.getRoot();
            if (root.scrollable) {
                const top = dom.getOffset(root.__ul).top;
                let h = 0;
                common.each(root.__ul.childNodes, function (node) {
                    if (!(root.autoPlace && node === root.__save_row)) {
                        h += dom.getHeight(node);
                    }
                });
                if (window.innerHeight - top - CLOSE_BUTTON_HEIGHT < h) {
                    dom.addClass(root.domElement, GUI.CLASS_TOO_TALL);
                    root.__ul.style.height = window.innerHeight - top - CLOSE_BUTTON_HEIGHT + 'px';
                } else {
                    dom.removeClass(root.domElement, GUI.CLASS_TOO_TALL);
                    root.__ul.style.height = 'auto';
                }
            }
            if (root.__resize_handle) {
                common.defer(function () {
                    root.__resize_handle.style.height = root.__ul.offsetHeight + 'px';
                });
            }
            if (root.__closeButton) {
                root.__closeButton.style.width = root.width + 'px';
            }
        },
        onResizeDebounced: common.debounce(function () {
            this.onResize();
        }, 50),
        remember: function () {
            if (common.isUndefined(SAVE_DIALOGUE)) {
                SAVE_DIALOGUE = new CenteredDiv();
                SAVE_DIALOGUE.domElement.innerHTML = saveDialogueContents;
            }
            if (this.parent) {
                throw new Error('You can only call remember on a top level GUI.');
            }
            const _this = this;
            common.each(Array.prototype.slice.call(arguments), function (object) {
                if (_this.__rememberedObjects.length === 0) {
                    addSaveMenu(_this);
                }
                if (_this.__rememberedObjects.indexOf(object) === -1) {
                    _this.__rememberedObjects.push(object);
                }
            });
            if (this.autoPlace) {
                setWidth(this, this.width);
            }
        },
        getRoot: function () {
            let gui = this;
            while (gui.parent) {
                gui = gui.parent;
            }
            return gui;
        },
        getSaveObject: function () {
            const toReturn = this.load;
            toReturn.closed = this.closed;
            if (this.__rememberedObjects.length > 0) {
                toReturn.preset = this.preset;
                if (!toReturn.remembered) {
                    toReturn.remembered = {};
                }
                toReturn.remembered[this.preset] = getCurrentPreset(this);
            }
            toReturn.folders = {};
            common.each(this.__folders, function (element, key) {
                toReturn.folders[key] = element.getSaveObject();
            });
            return toReturn;
        },
        save: function () {
            if (!this.load.remembered) {
                this.load.remembered = {};
            }
            this.load.remembered[this.preset] = getCurrentPreset(this);
            markPresetModified(this, false);
            this.saveToLocalStorageIfPossible();
        },
        saveAs: function (presetName) {
            if (!this.load.remembered) {
                this.load.remembered = {};
                this.load.remembered[DEFAULT_DEFAULT_PRESET_NAME] = getCurrentPreset(this, true);
            }
            this.load.remembered[presetName] = getCurrentPreset(this);
            this.preset = presetName;
            addPresetOption(this, presetName, true);
            this.saveToLocalStorageIfPossible();
        },
        revert: function (gui) {
            common.each(this.__controllers, function (controller) {
                if (!this.getRoot().load.remembered) {
                    controller.setValue(controller.initialValue);
                } else {
                    recallSavedValue(gui || this.getRoot(), controller);
                }
                if (controller.__onFinishChange) {
                    controller.__onFinishChange.call(controller, controller.getValue());
                }
            }, this);
            common.each(this.__folders, function (folder) {
                folder.revert(folder);
            });
            if (!gui) {
                markPresetModified(this.getRoot(), false);
            }
        },
        listen: function (controller) {
            const init = this.__listening.length === 0;
            this.__listening.push(controller);
            if (init) {
                updateDisplays(this.__listening);
            }
        },
        updateDisplay: function () {
            common.each(this.__controllers, function (controller) {
                controller.updateDisplay();
            });
            common.each(this.__folders, function (folder) {
                folder.updateDisplay();
            });
        }
    });
    function addRow(gui, newDom, liBefore) {
        const li = document.createElement('li');
        if (newDom) {
            li.appendChild(newDom);
        }
        if (liBefore) {
            gui.__ul.insertBefore(li, liBefore);
        } else {
            gui.__ul.appendChild(li);
        }
        gui.onResize();
        return li;
    }
    function removeListeners(gui) {
        dom.unbind(window, 'resize', gui.__resizeHandler);
        if (gui.saveToLocalStorageIfPossible) {
            dom.unbind(window, 'unload', gui.saveToLocalStorageIfPossible);
        }
    }
    function markPresetModified(gui, modified) {
        const opt = gui.__preset_select[gui.__preset_select.selectedIndex];
        if (modified) {
            opt.innerHTML = opt.value + '*';
        } else {
            opt.innerHTML = opt.value;
        }
    }
    function augmentController(gui, li, controller) {
        controller.__li = li;
        controller.__gui = gui;
        common.extend(controller, {
            options: function (options) {
                if (arguments.length > 1) {
                    const nextSibling = controller.__li.nextElementSibling;
                    controller.remove();
                    return add(gui, controller.object, controller.property, {
                        before: nextSibling,
                        factoryArgs: [common.toArray(arguments)]
                    });
                }
                if (common.isArray(options) || common.isObject(options)) {
                    const nextSibling = controller.__li.nextElementSibling;
                    controller.remove();
                    return add(gui, controller.object, controller.property, {
                        before: nextSibling,
                        factoryArgs: [options]
                    });
                }
            },
            name: function (name) {
                controller.__li.firstElementChild.firstElementChild.innerHTML = name;
                return controller;
            },
            listen: function () {
                controller.__gui.listen(controller);
                return controller;
            },
            remove: function () {
                controller.__gui.remove(controller);
                return controller;
            }
        });
        if (controller instanceof NumberControllerSlider) {
            const box = new NumberControllerBox(controller.object, controller.property, {
                min: controller.__min,
                max: controller.__max,
                step: controller.__step
            });
            common.each([
                'updateDisplay',
                'onChange',
                'onFinishChange',
                'step',
                'min',
                'max'
            ], function (method) {
                const pc = controller[method];
                const pb = box[method];
                controller[method] = box[method] = function () {
                    const args = Array.prototype.slice.call(arguments);
                    pb.apply(box, args);
                    return pc.apply(controller, args);
                };
            });
            dom.addClass(li, 'has-slider');
            controller.domElement.insertBefore(box.domElement, controller.domElement.firstElementChild);
        } else if (controller instanceof NumberControllerBox) {
            const r = function (returned) {
                if (common.isNumber(controller.__min) && common.isNumber(controller.__max)) {
                    const oldName = controller.__li.firstElementChild.firstElementChild.innerHTML;
                    const wasListening = controller.__gui.__listening.indexOf(controller) > -1;
                    controller.remove();
                    const newController = add(gui, controller.object, controller.property, {
                        before: controller.__li.nextElementSibling,
                        factoryArgs: [
                            controller.__min,
                            controller.__max,
                            controller.__step
                        ]
                    });
                    newController.name(oldName);
                    if (wasListening)
                        newController.listen();
                    return newController;
                }
                return returned;
            };
            controller.min = common.compose(r, controller.min);
            controller.max = common.compose(r, controller.max);
        } else if (controller instanceof BooleanController) {
            dom.bind(li, 'click', function () {
                dom.fakeEvent(controller.__checkbox, 'click');
            });
            dom.bind(controller.__checkbox, 'click', function (e) {
                e.stopPropagation();
            });
        } else if (controller instanceof FunctionController) {
            dom.bind(li, 'click', function () {
                dom.fakeEvent(controller.__button, 'click');
            });
            dom.bind(li, 'mouseover', function () {
                dom.addClass(controller.__button, 'hover');
            });
            dom.bind(li, 'mouseout', function () {
                dom.removeClass(controller.__button, 'hover');
            });
        } else if (controller instanceof ColorController) {
            dom.addClass(li, 'color');
            controller.updateDisplay = common.compose(function (val) {
                li.style.borderLeftColor = controller.getValue(); //controller.__color.toString();
                return val;
            }, controller.updateDisplay);
            controller.updateDisplay();
        }
        controller.setValue = common.compose(function (val) {
            if (gui.getRoot().__preset_select && controller.isModified()) {
                markPresetModified(gui.getRoot(), true);
            }
            return val;
        }, controller.setValue);
    }
    function recallSavedValue(gui, controller) {
        const root = gui.getRoot();
        const matchedIndex = root.__rememberedObjects.indexOf(controller.object);
        if (matchedIndex !== -1) {
            let controllerMap = root.__rememberedObjectIndecesToControllers[matchedIndex];
            if (controllerMap === undefined) {
                controllerMap = {};
                root.__rememberedObjectIndecesToControllers[matchedIndex] = controllerMap;
            }
            controllerMap[controller.property] = controller;
            if (root.load && root.load.remembered) {
                const presetMap = root.load.remembered;
                let preset;
                if (presetMap[gui.preset]) {
                    preset = presetMap[gui.preset];
                } else if (presetMap[DEFAULT_DEFAULT_PRESET_NAME]) {
                    preset = presetMap[DEFAULT_DEFAULT_PRESET_NAME];
                } else {
                    return;
                }
                if (preset[matchedIndex] && preset[matchedIndex][controller.property] !== undefined) {
                    const value = preset[matchedIndex][controller.property];
                    controller.initialValue = value;
                    controller.setValue(value);
                }
            }
        }
    }
    function add(gui, object, property, params) {
        if (object[property] === undefined) {
            throw new Error(`Object "${ object }" has no property "${ property }"`);
        }
        let controller;
        if (params.color) {
            controller = new ColorController(object, property);
        } else {
            const factoryArgs = [
                object,
                property
            ].concat(params.factoryArgs);
            controller = ControllerFactory.apply(gui, factoryArgs);
        }
        if (params.before instanceof Controller) {
            params.before = params.before.__li;
        }
        recallSavedValue(gui, controller);
        dom.addClass(controller.domElement, 'c');
        const name = document.createElement('span');
        dom.addClass(name, 'property-name');
        name.innerHTML = controller.property;
        const container = document.createElement('div');
        container.appendChild(name);
        container.appendChild(controller.domElement);
        const li = addRow(gui, container, params.before);
        dom.addClass(li, GUI.CLASS_CONTROLLER_ROW);
        if (controller instanceof ColorController) {
            dom.addClass(li, 'color');
        } else {
            dom.addClass(li, typeof controller.getValue());
        }
        augmentController(gui, li, controller);
        gui.__controllers.push(controller);
        return controller;
    }
    function getLocalStorageHash(gui, key) {
        return document.location.href + '.' + key;
    }
    function addPresetOption(gui, name, setSelected) {
        const opt = document.createElement('option');
        opt.innerHTML = name;
        opt.value = name;
        gui.__preset_select.appendChild(opt);
        if (setSelected) {
            gui.__preset_select.selectedIndex = gui.__preset_select.length - 1;
        }
    }
    function showHideExplain(gui, explain) {
        explain.style.display = gui.useLocalStorage ? 'block' : 'none';
    }
    function addSaveMenu(gui) {
        const div = gui.__save_row = document.createElement('li');
        dom.addClass(gui.domElement, 'has-save');
        gui.__ul.insertBefore(div, gui.__ul.firstChild);
        dom.addClass(div, 'save-row');
        const gears = document.createElement('span');
        gears.innerHTML = '&nbsp;';
        dom.addClass(gears, 'button gears');
        const button = document.createElement('span');
        button.innerHTML = 'Save';
        dom.addClass(button, 'button');
        dom.addClass(button, 'save');
        const button2 = document.createElement('span');
        button2.innerHTML = 'New';
        dom.addClass(button2, 'button');
        dom.addClass(button2, 'save-as');
        const button3 = document.createElement('span');
        button3.innerHTML = 'Revert';
        dom.addClass(button3, 'button');
        dom.addClass(button3, 'revert');
        const select = gui.__preset_select = document.createElement('select');
        if (gui.load && gui.load.remembered) {
            common.each(gui.load.remembered, function (value, key) {
                addPresetOption(gui, key, key === gui.preset);
            });
        } else {
            addPresetOption(gui, DEFAULT_DEFAULT_PRESET_NAME, false);
        }
        dom.bind(select, 'change', function () {
            for (let index = 0; index < gui.__preset_select.length; index++) {
                gui.__preset_select[index].innerHTML = gui.__preset_select[index].value;
            }
            gui.preset = this.value;
        });
        div.appendChild(select);
        div.appendChild(gears);
        div.appendChild(button);
        div.appendChild(button2);
        div.appendChild(button3);
        if (SUPPORTS_LOCAL_STORAGE) {
            const explain = document.getElementById('dg-local-explain');
            const localStorageCheckBox = document.getElementById('dg-local-storage');
            const saveLocally = document.getElementById('dg-save-locally');
            saveLocally.style.display = 'block';
            if (localStorage.getItem(getLocalStorageHash(gui, 'isLocal')) === 'true') {
                localStorageCheckBox.setAttribute('checked', 'checked');
            }
            showHideExplain(gui, explain);
            dom.bind(localStorageCheckBox, 'change', function () {
                gui.useLocalStorage = !gui.useLocalStorage;
                showHideExplain(gui, explain);
            });
        }
        const newConstructorTextArea = document.getElementById('dg-new-constructor');
        dom.bind(newConstructorTextArea, 'keydown', function (e) {
            if (e.metaKey && (e.which === 67 || e.keyCode === 67)) {
                SAVE_DIALOGUE.hide();
            }
        });
        dom.bind(gears, 'click', function () {
            newConstructorTextArea.innerHTML = JSON.stringify(gui.getSaveObject(), undefined, 2);
            SAVE_DIALOGUE.show();
            newConstructorTextArea.focus();
            newConstructorTextArea.select();
        });
        dom.bind(button, 'click', function () {
            gui.save();
        });
        dom.bind(button2, 'click', function () {
            const presetName = prompt('Enter a new preset name.');
            if (presetName) {
                gui.saveAs(presetName);
            }
        });
        dom.bind(button3, 'click', function () {
            gui.revert();
        });
    }
    function addResizeHandle(gui) {
        let pmouseX;
        gui.__resize_handle = document.createElement('div');
        common.extend(gui.__resize_handle.style, {
            width: '6px',
            marginLeft: '-3px',
            height: '200px',
            cursor: 'ew-resize',
            position: 'absolute'
        });
        function drag(e) {
            e.preventDefault();
            gui.width += pmouseX - e.clientX;
            gui.onResize();
            pmouseX = e.clientX;
            return false;
        }
        function dragStop() {
            dom.removeClass(gui.__closeButton, GUI.CLASS_DRAG);
            dom.unbind(window, 'mousemove', drag);
            dom.unbind(window, 'mouseup', dragStop);
        }
        function dragStart(e) {
            e.preventDefault();
            pmouseX = e.clientX;
            dom.addClass(gui.__closeButton, GUI.CLASS_DRAG);
            dom.bind(window, 'mousemove', drag);
            dom.bind(window, 'mouseup', dragStop);
            return false;
        }
        dom.bind(gui.__resize_handle, 'mousedown', dragStart);
        dom.bind(gui.__closeButton, 'mousedown', dragStart);
        gui.domElement.insertBefore(gui.__resize_handle, gui.domElement.firstElementChild);
    }
    function setWidth(gui, w) {
        gui.domElement.style.width = w + 'px';
        if (gui.__save_row && gui.autoPlace) {
            gui.__save_row.style.width = w + 'px';
        }
        if (gui.__closeButton) {
            gui.__closeButton.style.width = w + 'px';
        }
    }
    function getCurrentPreset(gui, useInitialValues) {
        const toReturn = {};
        common.each(gui.__rememberedObjects, function (val, index) {
            const savedValues = {};
            const controllerMap = gui.__rememberedObjectIndecesToControllers[index];
            common.each(controllerMap, function (controller, property) {
                savedValues[property] = useInitialValues ? controller.initialValue : controller.getValue();
            });
            toReturn[index] = savedValues;
        });
        return toReturn;
    }
    function setPresetSelectIndex(gui) {
        for (let index = 0; index < gui.__preset_select.length; index++) {
            if (gui.__preset_select[index].value === gui.preset) {
                gui.__preset_select.selectedIndex = index;
            }
        }
    }
    function updateDisplays(controllerArray) {
        if (controllerArray.length !== 0) {
            requestAnimationFrame.call(window, function () {
                updateDisplays(controllerArray);
            });
        }
        common.each(controllerArray, function (c) {
            c.updateDisplay();
        });
    }
    return GUI;
});