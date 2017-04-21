require_relative 'boot'
require 'rails/all'

Bundler.require(*Rails.groups)

module Activemile
  class Application < Rails::Application
    config.middleware.use Rack::Cors do
      allow do
        origins '*'
        resource '*', headers: :any, methods: [:get, :post, :put, :patch, :delete, :options, :head]
      end
    end

    config.autoload_paths += Dir["#{config.root}/app/models/**/"]
    config.action_controller.allow_forgery_protection = false
  end
end
