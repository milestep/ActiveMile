class Api::V1::HolidaysController < Api::V1::BaseController
  skip_before_action :doorkeeper_authorize!, only: :index
  expose :holiday,  -> { Holiday.find(params[:id]) }
  expose :holidays, -> { Holiday.all }

  def index
    render_api(holidays, :ok, each_serializer: HolidaySerializer)
  end

  def create
    return render_api(holidays, :created) if holidays.create(holiday_params)
    render json: { errors: holidays.errors.messages }, status: :unprocessable_entity
  end

  def update
   return render_api(:accepted) if holiday.update(holiday_params)
   render json: { errors: holiday.errors.messages }, status: :unprocessable_entity
  end

  def destroy
    return render_api(:ok) if holiday.destroy
    render json: { errors: holiday.errors.messages }, status: :unprocessable_entity
  end

  def show
   return render_api(holiday, :ok, each_serializer: HolidaySerializer) if holiday
   render json: { errors: 'Record not found' }, status: 404
  end

  private

  def holiday_params
    params.require(:holiday).permit(:name, :date)
  end
end
