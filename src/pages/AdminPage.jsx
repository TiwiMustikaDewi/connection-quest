import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShieldCheck, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';

export function AdminPage() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const isIndo = language === 'id';

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-1 flex flex-col justify-center max-w-lg mx-auto w-full py-4 space-y-4"
    >
      <div className="text-center space-y-1">
        <Badge variant="neutral" icon={ShieldCheck}>
          Phase 6 Preview
        </Badge>
        <h2 className="text-2xl font-bold text-slate-800 font-display">
          {t('admin.title')}
        </h2>
        <p className="text-xs text-slate-600">
          {t('admin.subtitle')}
        </p>
      </div>

      <Card variant="neutral" className="p-6 text-center space-y-3">
        <p className="text-xs text-slate-600">
          {isIndo
            ? 'Portal Admin dengan autentikasi Supabase Auth, rekap submission per Homegroup, dan ekspor CSV akan diimplementasikan pada Phase 6.'
            : 'Admin Portal with Supabase Auth, Homegroup submission filters, and CSV export will be implemented in Phase 6.'}
        </p>
      </Card>

      <div className="pt-2">
        <Button
          variant="outline"
          onClick={() => navigate('/')}
          icon={ArrowLeft}
          className="w-full"
        >
          {t('common.back')}
        </Button>
      </div>
    </motion.div>
  );
}
