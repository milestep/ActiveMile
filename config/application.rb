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

    config.action_controller.allow_forgery_protection = false
    config.autoload_paths += %W["#{config.root}/app/validators/"]
  end
end
