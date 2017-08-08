class CounterpartiesSerializer < ActiveModel::Serializer
  attributes :id, :name, :date, :type
=begin
, :created_at, :updated_at
=end
end
