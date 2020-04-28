define([
    "skylark-langx-ns",
    './color/Color',
    './color/math',
    './color/interpret',
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
], function (skylark,Color, math, interpret, Controller, BooleanController, OptionController, StringController, NumberController, NumberControllerBox, NumberControllerSlider, FunctionController, ColorController, domImport, GUIImport) {
    'use strict';
    const color = {
        Color: Color,
        math: math,
        interpret: interpret
    };
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
        color,
        controllers,
        dom,
        gui,
        GUI
    });
});