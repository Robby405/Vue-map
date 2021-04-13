import toolButton from './src/toolButton';

toolButton.install = function (Vue) {
    Vue.component(toolButton.name, toolButton);
}

export default toolButton;