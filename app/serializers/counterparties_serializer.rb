class CounterpartiesSerializer < ActiveModel::Serializer
  attributes :id, :name, :date, :type, :active, :registers_count, :salary
end
