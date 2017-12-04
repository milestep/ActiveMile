class ArticlesSerializer < ActiveModel::Serializer
  attributes :id, :title, :type, :registers_count
end
