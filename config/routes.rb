Rails.application.routes.draw do
  scope :api do
    use_doorkeeper

    namespace :v1 do
      resources :users, only: [:index, :create, :show, :update, :destroy]
    end
  end
end
