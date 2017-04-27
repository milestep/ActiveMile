class ApiController < ApplicationController
  def perform_caching
    Rails.configuration.action_controller.perform_caching
  end
end
