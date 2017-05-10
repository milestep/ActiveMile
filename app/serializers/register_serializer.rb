class RegisterSerializer < ActiveModel::Serializer
  attributes :id, :date, :value, :created_at, :note, :updated_at
  belongs_to :workspace
  belongs_to :article
  belongs_to :counterparty
end
