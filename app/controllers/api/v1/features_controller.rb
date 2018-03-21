class Api::V1::FeaturesController < Api::V1::BaseController
  expose :feature, -> { current_workspace.feature }

  def show
    render_api(feature, :ok, each_serializer: FeaturesSerializer)
  end

  def update
    feature.update(features_params)
    render_api(:accepted)
  end

  private

  def features_params
    params.require(:feature).permit(:sales)
  end
end
