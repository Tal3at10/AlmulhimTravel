import { HiOutlineClock } from 'react-icons/hi';

export default function ComingSoonPage({ title = 'قريباً', description = 'هذا القسم قيد التطوير' }) {
    return (
        <div className="animate-in">
            <div className="card" style={{ marginTop: 40 }}>
                <div className="empty-state">
                    <HiOutlineClock className="empty-state-icon" />
                    <h3>{title}</h3>
                    <p>{description}</p>
                </div>
            </div>
        </div>
    );
}
