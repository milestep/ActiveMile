class Api::V1::WorkspacesController < Api::V1::BaseController
  skip_before_action :doorkeeper_authorize!, only: :index
  expose :workspaces, -> { Workspace.order(updated_at: :asc) }
  expose :workspace

  def index
    render_api(workspaces, :ok, each_serializer: WorkspacesSerializer)
    binding.pry
  end

  def create
    workspace.save
    render_api(workspace, :created, serializer: WorkspaceSerializer)
  end

  private

  def workspace_params
    params.require(:workspace).permit(:title)
  end
end
