class Api::V1::FeaturesController < Api::V1::BaseController
  skip_before_action :doorkeeper_authorize!, only: :index
  expose :features, -> { current_workspace.feature }

  def show
    p '******************'
    p 'index'
    p '******************'
    render_api(features, :ok, each_serializer: FeaturesSerializer)
    # render_api(workspace.features, :ok, each_serializer: FeaturesSerializer)
    # render_api(:accepted)
  end

  def update

    # features = Feature.find_by_workspace_id(params[:id])


    # p '******************'
    # p current_workspace.feature
    # p '******************'

    p '*********************'
    p '*********************'
    # p current_workspace.feature
    p '*********************'
    features.update(features_params)
    render_api(:accepted)
    p '*********************'
    p '*********************'
    p '*********************'

    # p '***************************'
    # p features
    # p '***************************'
  end

  private

  def features_params
    params.require(:feature).permit(:sales)
  end
end
