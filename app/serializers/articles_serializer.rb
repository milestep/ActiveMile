class ArticlesSerializer < ActiveModel::Serializer
  attributes :id, :title, :type, :created_at, :updated_at
end
