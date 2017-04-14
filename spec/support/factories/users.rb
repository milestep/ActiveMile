FactoryGirl.define do
  factory :user do
    email     { Faker::Internet.email }
    password  { Faker::Number.number(8) }
  end

  factory :authenticated_user, parent: :user do
    access_token factory: :access_token
  end
end
