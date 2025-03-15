import OptionButton from './OptionButton';

export default function VotingBar() {
  // Just for testing purposes
  const options = ['UNSW', 'USYD', 'UTS'];

  return (
    <div className='flex flex-col items-center justify-center bg-white rounded-xl px-3 py-5 w-1/2 gap-3 border-2 border-gray-200'>
      <h3 className='text-xl font-semibold text-purple-600'>Preferred location</h3>
      <div className='flex flex-col items-center justify-center gap-3 w-[80%] p-1'>
        {options.map(option => {
          return <OptionButton option={option}/>
        })}
      </div>
    </div>
  )
}