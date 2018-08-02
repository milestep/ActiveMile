FactoryGirl.define do
  factory :register do
    date             { Date.current }
    value            { Faker::Number.between(1, 10) }
    note             { Faker::Lorem.word }
    article          factory: :article
    counterparty     factory: :counterparty
    workspace        factory: :workspace
  end
end
