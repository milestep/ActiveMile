class RegistersSerializer < ActiveModel::Serializer
  attributes :id, :date, :value, :created_at, :note, :updated_at
end
