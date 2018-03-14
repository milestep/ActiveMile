class Api::V1::FeaturesController < Api::V1::BaseController
  expose :features, -> { current_workspace.feature }

  def show
    render_api(features, :ok, each_serializer: FeaturesSerializer)
  end

  def update
    features.update(features_params)
    render_api(:accepted)
  end

  private

  def features_params
    params.require(:feature).permit(:sales)
  end
end
