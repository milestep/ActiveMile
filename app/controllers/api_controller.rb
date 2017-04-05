class ApiController < ApplicationController
  include Verifiable
  
  def perform_caching
    Rails.configuration.action_controller.perform_caching
  end
  
  def doorkeeper_unauthorized_render_options(error: nil)
    { json: { error: "Not authorized" } }
  end

  def current_user
    return @current_user if defined? @current_user
    @current_user = User.find(doorkeeper_token.resource_owner_id) if doorkeeper_token
  end
end
