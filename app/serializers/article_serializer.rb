class ArticleSerializer < ActiveModel::Serializer
  attributes :id, :title, :type, :workspace_id, :created_at, :updated_at
  belongs_to :workspace, serializer: WorkspaceSerializer
end
