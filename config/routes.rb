Rails.application.routes.draw do
  use_doorkeeper

  scope module: :api, defaults: { format: 'json' } do
    namespace :v1 do
      resources :users, only: [:index, :create, :show, :update, :destroy]
    end
  end

  root to: 'doorkeeper/applications#index'
end
