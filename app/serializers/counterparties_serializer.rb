class CounterpartiesSerializer < ActiveModel::Serializer
  attributes :id, :name, :date, :type, :created_at, :updated_at
end