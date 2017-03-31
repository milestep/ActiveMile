class UserSerializer < ActiveModel::Serializer
  attributes :id, :title, :description, :priority, :due_date, :completed, :created_at, :updated_at
end
