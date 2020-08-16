define([
    "skylark-langx-ns",
    './controllers/Controller',
    './controllers/BooleanController',
    './controllers/OptionController',
    './controllers/StringController',
    './controllers/NumberController',
    './controllers/NumberControllerBox',
    './controllers/NumberControllerSlider',
    './controllers/FunctionController',
    './controllers/ColorController',
    './dom/dom',
    './gui/GUI'
], function (skylark,Controller, BooleanController, OptionController, StringController, NumberController, NumberControllerBox, NumberControllerSlider, FunctionController, ColorController, domImport, GUIImport) {
    'use strict';

    const controllers = {
        Controller: Controller,
        BooleanController: BooleanController,
        OptionController: OptionController,
        StringController: StringController,
        NumberController: NumberController,
        NumberControllerBox: NumberControllerBox,
        NumberControllerSlider: NumberControllerSlider,
        FunctionController: FunctionController,
        ColorController: ColorController
    };
    const dom = { dom: domImport };
    const gui = { GUI: GUIImport };
    const GUI = GUIImport;
    return skylark.attach("intg.datgui",{
        controllers,
        dom,
        gui,
        GUI
    });
});