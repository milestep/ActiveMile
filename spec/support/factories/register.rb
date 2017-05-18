FactoryGirl.define do
  factory :register do
    date             { Faker::Date.between(2.days.ago, Date.today) }
    value            { Faker::Number.between(1, 10) }
    note             { Faker::Lorem.word }
    article          factory: :article
    counterparty     factory: :counterparty
    workspace        factory: :workspace
  end
end
