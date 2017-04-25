class ArticlesSerializer < ActiveModel::Serializer
  attributes :id, :title, :type, :workspace_id, :created_at, :updated_at
end
