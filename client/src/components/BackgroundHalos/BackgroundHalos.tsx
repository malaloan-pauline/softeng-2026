import './BackgroundHalos.css';

export default function BackgroundHalos() {
  return (
    <div className="bg-halos" aria-hidden="true">
      <div className="halo halo-green" />
      <div className="halo halo-pink" />
      <div className="halo halo-green-bottom" />
    </div>
  );
}