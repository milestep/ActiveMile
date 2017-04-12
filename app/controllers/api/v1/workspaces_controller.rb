class Api::V1::WorkspacesController < Api::V1::BaseController
  skip_before_action :doorkeeper_authorize!, only: [:index]

  def index
    @workspaces = Workspace.all.order(updated_at: :desc)
    render_api(@workspaces, :ok, each_serializer: WorkspacesSerializer)
  end

  def create
    @workspace = Workspace.new(workspace_params)
    @workspace.save
    render_api(@workspace, :created, serializer: WorkspaceSerializer)
  end

  private

  def workspace_params
    params.require(:workspace).permit(:title)
  end
end
