import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import apiService from '../../services/api.service';
import LoadingSpinner from '../ui/LoadingSpinner';

function TestimonialCard({ testimonial, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative rounded-2xl p-[2px] bg-gradient-to-br from-slate-700 via-[#C9A227] to-slate-700 shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <div className="bg-white rounded-2xl p-6 h-full flex flex-col">
        <div className="mb-4">
          <Quote className="w-8 h-8 text-[#C9A227] fill-[#C9A227]/20" />
        </div>
        <p className="text-slate-800 text-base font-medium leading-relaxed mb-6 flex-grow">
          "{testimonial.content}"
        </p>
        <div className="flex items-center justify-between border-t border-slate-100 pt-4">
          {testimonial.customerName && (
            <span className="font-bold text-slate-800">{testimonial.customerName}</span>
          )}
          {testimonial.customerTitle && (
            <span className="text-sm text-[#C9A227] font-medium mr-auto">
              {testimonial.customerTitle}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function TestimonialsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [currentPage, setCurrentPage] = useState(0);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await apiService.cms.getTestimonials();
        if (Array.isArray(response) && response.length > 0) {
          setTestimonials(response);
        }
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  const totalPages = Math.ceil(testimonials.length / itemsPerPage);

  const currentTestimonials = testimonials.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const nextPage = () => setCurrentPage((prev) => (prev + 1) % totalPages);
  const prevPage = () => setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);

  if (loading) {
    return (
      <section className="py-20 bg-slate-50">
        <div className="flex justify-center py-10">
          <LoadingSpinner size="lg" />
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} className="py-20 bg-slate-50 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-serif text-slate-800 mb-4">
            بعض آراء عملائنا
          </h2>
          <div className="w-20 h-1 bg-[#C9A227] mx-auto mb-4" />
          <p className="text-slate-600">شكراً لثقتكم في سفريات الملحم</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-8">
          {currentTestimonials.map((testimonial, index) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} index={index} />
          ))}
        </div>

        <div className="flex items-center justify-center gap-4">
          <button onClick={prevPage} aria-label="السابق" className="p-2 rounded-full bg-white shadow-md hover:shadow-lg text-slate-700 hover:text-[#C9A227]">
            <ChevronRight className="w-6 h-6" />
          </button>
          <div className="flex gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i)}
                aria-label={`تخطي للصفحة ${i + 1}`}
                className={`w-3 h-3 rounded-full transition-all ${currentPage === i ? 'bg-[#C9A227] w-6' : 'bg-slate-300'}`}
              />
            ))}
          </div>
          <button onClick={nextPage} aria-label="التالي" className="p-2 rounded-full bg-white shadow-md hover:shadow-lg text-slate-700 hover:text-[#C9A227]">
            <ChevronLeft className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  );
}

export default TestimonialsSection;