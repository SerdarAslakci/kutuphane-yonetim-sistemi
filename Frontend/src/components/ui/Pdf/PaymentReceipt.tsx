'use client';

import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font, Image } from '@react-pdf/renderer';
import { UserFineDto } from '@/src/types/user';


const styles = StyleSheet.create({
    page: { padding: 40, fontFamily: 'Helvetica', fontSize: 12, color: '#333' },
    header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 10 },
    logo: { fontSize: 24, fontWeight: 'bold', color: '#78350f' },
    invoiceDetails: { alignItems: 'flex-end' },
    label: { fontSize: 10, color: '#666', marginBottom: 2 },
    value: { fontSize: 12, marginBottom: 5 },
    section: { marginVertical: 10 },
    sectionTitle: { fontSize: 14, fontWeight: 'bold', marginBottom: 10, color: '#78350f', textTransform: 'uppercase' },
    row: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#f0f0f0', paddingVertical: 8 },
    col1: { width: '40%' },
    col2: { width: '30%' },
    col3: { width: '30%', textAlign: 'right' },
    totalRow: { flexDirection: 'row', marginTop: 10, paddingTop: 10, borderTopWidth: 2, borderTopColor: '#78350f' },
    totalLabel: { width: '70%', textAlign: 'right', paddingRight: 10, fontWeight: 'bold' },
    totalValue: { width: '30%', textAlign: 'right', fontWeight: 'bold', fontSize: 16, color: '#78350f' },
    footer: { position: 'absolute', bottom: 30, left: 40, right: 40, textAlign: 'center', fontSize: 10, color: '#999', borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 10 }
});

interface Props {
    fine: UserFineDto;
    userName: string;
    paymentId: string;
}

export const PaymentReceiptPdf = ({ fine, userName, paymentId }: Props) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.logo}>Kutuphane</Text>
                    <Text style={{ fontSize: 10, color: '#666', marginTop: 5 }}>Online Odeme Sistemleri</Text>
                </View>
                <View style={styles.invoiceDetails}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>TAHSILAT MAKBUZU</Text>
                    <Text style={styles.label}>Makbuz No:</Text>
                    <Text style={styles.value}>#{paymentId}</Text>
                    <Text style={styles.label}>Tarih:</Text>
                    <Text style={styles.value}>{new Date().toLocaleDateString('tr-TR')}</Text>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Sayin:</Text>
                <Text style={{ fontSize: 14, marginBottom: 4 }}>{userName.toUpperCase().toString()}</Text>
                <Text style={{ color: '#666', fontSize: 10 }}>Bu belge, asagidaki borc kaleminin odendigini teyit eder.</Text>
            </View>

            <View style={[styles.row, { backgroundColor: '#f9fafb', borderBottomWidth: 0, marginTop: 20 }]}>
                <Text style={[styles.col1, { fontWeight: 'bold', paddingLeft: 5 }]}>Aciklama / Kitap</Text>
                <Text style={[styles.col2, { fontWeight: 'bold' }]}>Ceza Tipi</Text>
                <Text style={[styles.col3, { fontWeight: 'bold', paddingRight: 5 }]}>Tutar</Text>
            </View>

            <View style={styles.row}>
                <Text style={[styles.col1, { paddingLeft: 5 }]}>
                    {fine.loanDetails ? fine.loanDetails.bookTitle : fine.description}
                </Text>
                <Text style={styles.col2}>{fine.fineType.toUpperCase().toString()}</Text>
                <Text style={styles.col3}>{fine.amount.toFixed(2)} TL</Text>
            </View>

            <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>ODENEN TOPLAM:</Text>
                <Text style={styles.totalValue}>{fine.amount.toFixed(2)} TL</Text>
            </View>

            <View style={{ marginTop: 40 }}>
                <Text style={{ fontSize: 10, color: '#666' }}>Odeme Yontemi: Kredi Karti (Sanil)</Text>
                <Text style={{ fontSize: 10, color: '#666' }}>Islem Durumu: BASARILI</Text>
            </View>

            <View style={styles.footer}>
                <Text>Kutuphane Yonetim Sistemi - Otomatik olarak olusturulmustur.</Text>
                <Text>Tesekkur ederiz.</Text>
            </View>
        </Page>
    </Document>
);