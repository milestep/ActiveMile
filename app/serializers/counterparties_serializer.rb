class CounterpartiesSerializer < ActiveModel::Serializer
  attributes :id, :name, :date, :type, :workspace_id
end