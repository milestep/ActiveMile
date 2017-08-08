class WorkspaceSerializer < ActiveModel::Serializer
  attributes :id, :title
=begin
, :created_at, :updated_at
=end
  has_many   :articles, serializer: ArticleSerializer
end
