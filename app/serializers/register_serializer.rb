class RegisterSerializer < ActiveModel::Serializer
  attributes :id, :date, :value, :note, :article_id, :counterparty_id
=begin
, :created_at, :updated_at
=end
  belongs_to :article
  belongs_to :counterparty
end
