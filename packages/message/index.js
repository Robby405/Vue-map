import message from './src/message';

message.install = function (Vue) {
    Vue.component(message.name, message);
}

export default message;