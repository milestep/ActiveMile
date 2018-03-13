class Api::V1::WorkspacesController < Api::V1::BaseController
  skip_before_action :doorkeeper_authorize!, only: :index
  expose :workspaces, -> { Workspace.order(id: :asc) }
  expose :workspace

  def index
    render_api(workspaces, :ok, each_serializer: WorkspacesSerializer)
  end

  def create
    workspace.save
    render_api(workspace, :created)
  end

  def update
    workspace.update(workspace_params)
    render_api(workspace, :accepted)
  end

  def destroy
    workspace.destroy
    render json: { message: I18n.t('workspaces.destroy.success') }, status: :ok
  end

  private

  def workspace_params
    params.require(:workspace).permit(:title)
  end
end
