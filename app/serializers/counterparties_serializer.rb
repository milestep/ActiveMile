class CounterpartiesSerializer < ActiveModel::Serializer
  attributes :id, :name, :date, :type, :active
end
