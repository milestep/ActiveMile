class Api::V1::BaseController < ActionController::API
  before_action :doorkeeper_authorize!

  expose :current_user, model: User, id: -> { doorkeeper_token&.resource_owner_id }

  def perform_caching
    Rails.configuration.action_controller.perform_caching
  end
  
  def doorkeeper_unauthorized_render_options(error: nil)
    { json: { error: 'Not authorized' } }
  end

  def render_api(object, status = :ok, options = {})
    if object.respond_to?(:errors) && object.errors.present?
      render json: { message: object.errors.full_messages.to_sentence },
             status: :unprocessable_entity
    else
      render({ json: object, status: status }.merge(options))
    end
  end
end
