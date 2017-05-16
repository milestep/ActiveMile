Rails.application.routes.draw do
  dashboard_ctrl = 'api/dashboard#index'

  scope :api do
    use_doorkeeper
    get :/, to: dashboard_ctrl
  end

  namespace :api, defaults: { format: :json } do
    namespace :v1 do
      resources :users, only: [:create, :update, :destroy]
      resources :workspaces, except: [:show, :new]
      resources :articles, except: [:show, :new]
      resources :counterparties, except: [:show, :new]
      resources :registers, except: [:new]
    end
  end

  root dashboard_ctrl
end
