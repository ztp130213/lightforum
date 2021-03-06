/*global define*/
define([
    'jquery',
    'underscore',
    'underi18n',
    'backbone',
    'i18n/zh-cn',
    'text!templates/signup.html',
    'jquery.spin'
], function ($, _, underi18n, Backbone, zh_CN, signupTemplate) {
    'use strict';

    var SignUpView = Backbone.View.extend({

        tagName:  'div',
        className: "clearfix",

        // template: _.template(signupTemplate),
        
        events: {
            "click .signup":                        "signup",
            "keypress input[name=username]":        "keypresssignup",
            "keypress input[name=email]":           "keypresssignup",
            "keypress input[name=password1]":       "keypresssignup",
            "keypress input[name=password2]":       "keypresssignup",
        },

        initialize: function (options) {
            var zh = new zh_CN();
            var locale = underi18n.MessageFactory(zh);
            this.template = _.template(underi18n.template(signupTemplate, locale));
        
            _.bindAll(this, 'render', 'signup', 'keypresssignup');
        },

        render: function () {
            this.$el.html(this.template);
            return this;
        },

        signup: function(e){
            e.stopImmediatePropagation();
            e.preventDefault();

            var username = this.$el.find('input[name=username]').val().trim(),
                email = this.$el.find('input[name=email]').val().trim(),
                password1 = this.$el.find('input[name=password1]').val().trim(),
                password2 = this.$el.find('input[name=password2]').val().trim(),
                self = this,
                csrfmiddlewaretoken = $('meta[name="csrf-token"]').attr('content');

            if(!username){
                this.$el.find('input[name=username]').focus().closest('.form-group').addClass('has-error');
                return;
            }
            if(!email){
                this.$el.find('input[name=email]').focus().closest('.form-group').addClass('has-error');
                return;
            }
            if(!password1){
                this.$el.find('input[name=password1]').focus().closest('.form-group').addClass('has-error');
                return;
            }
            if(password1.length < 6){
                this.$el.find('input[name=password1]').focus().closest('.form-group').addClass('has-error');
                return;
            }
            if(!password2){
                this.$el.find('input[name=password2]').focus().closest('.form-group').addClass('has-error');
                return;
            }
            if(password2.length < 6){
                this.$el.find('input[name=password2]').focus().closest('.form-group').addClass('has-error');
                return;
            }
            if(password1 != password2){
                this.$el.find('input[name=password1]').closest('.form-group').addClass('has-error');
                this.$el.find('input[name=password2]').closest('.form-group').addClass('has-error');
                return;
            }

            if(username && password1 && password2){
                $.ajax({
                    type: 'POST',
                    url: '/accounts/register/',
                    dataType: 'json',
                    data: { username: username, email: email, password1: password1, password2: password2, csrfmiddlewaretoken: csrfmiddlewaretoken },
                }).done(function(data, textStatus, jqXHR){
                    if(textStatus === 'success'){
                        window.currentuser.set(data);
                        if(window.nexturl){
                            Backbone.history.navigate(window.nexturl, {trigger: true, replace: true});
                        } else {
                            Backbone.history.navigate('', {trigger: true, replace: true});
                        }
                    }
                }).fail(function(jqXHR, textStatus){
                    self.$el.find('input[name=username]').parent().addClass('has-error');
                    self.$el.find('input[name=username]').prev('label').removeClass('hide');
                });
            }
        },

        keypresssignup: function(e) {
            if (e.which !== 13) {
                return;
            }
            this.signup(e);
        },
    });

    return SignUpView;
});
